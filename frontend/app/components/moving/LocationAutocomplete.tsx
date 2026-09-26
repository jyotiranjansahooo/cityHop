"use client";

import {
  AlertCircle,
  Check,
  LocateFixed,
  LoaderCircle,
  MapPin,
  Navigation,
  Search,
} from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

interface GeocodingContextItem {
  mapbox_id?: string;
  name?: string;
  country_code?: string;
  country_code_alpha_3?: string;
  region_code?: string;
  region_code_full?: string;
  wikidata_id?: string;
}

type GeocodingContext = Record<string, GeocodingContextItem>;

export interface SelectedLocation {
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  state: string;
  district?: string;
  city?: string;
  country?: string;
}

interface LocationAutocompleteProps {
  label: string;
  placeholder: string;
  selectedLocation: SelectedLocation | null;
  onSelect: (location: SelectedLocation) => void;
  onClear: () => void;
  allowCurrentLocation?: boolean;
}

interface GeocodingProperties {
  mapbox_id?: string;
  feature_type?: string;
  name?: string;
  name_preferred?: string;
  place_formatted?: string;
  full_address?: string;
  context?: GeocodingContext;
}

interface GeocodingFeature {
  id?: string;
  type?: string;
  geometry?: {
    type?: string;
    coordinates?: number[];
  };
  properties?: GeocodingProperties;
}

interface GeocodingResponse {
  type?: string;
  features?: GeocodingFeature[];
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

const GEOCODING_URL = "https://api.mapbox.com/search/geocode/v6";

const findContext = (
  context: GeocodingContext | undefined,
  type: string,
): GeocodingContextItem | undefined => {
  if (!context) {
    return undefined;
  }

  return context[type];
};

const getStateName = (feature: GeocodingFeature): string => {
  const context = feature.properties?.context;

  const region = findContext(context, "region");

  return region?.name || "";
};

const getDistrictName = (feature: GeocodingFeature): string => {
  const context = feature.properties?.context;

  const district = findContext(context, "district");

  return district?.name || "";
};

const getCityName = (feature: GeocodingFeature): string => {
  const context = feature.properties?.context;

  const place = findContext(context, "place");

  if (place?.name) {
    return place.name;
  }

  const locality = findContext(context, "locality");

  return locality?.name || "";
};

const getCountryName = (feature: GeocodingFeature): string => {
  const context = feature.properties?.context;

  const country = findContext(context, "country");

  return country?.name || "";
};

const isOdishaLocation = (feature: GeocodingFeature): boolean => {
  const state = getStateName(feature);

  return state.trim().toLowerCase() === "odisha";
};

const getFeatureAddress = (feature: GeocodingFeature): string => {
  const properties = feature.properties;

  if (!properties) {
    return "";
  }

  if (properties.full_address) {
    return properties.full_address;
  }

  if (properties.place_formatted) {
    if (properties.name) {
      return properties.name + ", " + properties.place_formatted;
    }

    return properties.place_formatted;
  }

  return properties.name || "";
};

const createLocationFromFeature = (
  feature: GeocodingFeature,
): SelectedLocation | null => {
  const coordinates = feature.geometry?.coordinates;

  if (!coordinates || coordinates.length < 2) {
    return null;
  }

  const longitude = coordinates[0];
  const latitude = coordinates[1];

  if (
    typeof longitude !== "number" ||
    typeof latitude !== "number" ||
    !Number.isFinite(longitude) ||
    !Number.isFinite(latitude)
  ) {
    return null;
  }

  const properties = feature.properties;

  if (!properties) {
    return null;
  }

  const state = getStateName(feature);

  if (state.trim().toLowerCase() !== "odisha") {
    return null;
  }

  return {
    placeId:
      properties.mapbox_id ||
      feature.id ||
      "location-" + latitude.toFixed(6) + "-" + longitude.toFixed(6),

    name: properties.name_preferred || properties.name || "Selected location",

    address: getFeatureAddress(feature),

    latitude,
    longitude,

    state,

    district: getDistrictName(feature) || undefined,

    city: getCityName(feature) || undefined,

    country: getCountryName(feature) || undefined,
  };
};

export default function LocationAutocomplete({
  label,
  placeholder,
  selectedLocation,
  onSelect,
  onClear,
  allowCurrentLocation = false,
}: LocationAutocompleteProps): React.ReactElement {
  const [inputValue, setInputValue] = useState(selectedLocation?.address || "");

  const [suggestions, setSuggestions] = useState<GeocodingFeature[]>([]);

  const [isSearching, setIsSearching] = useState(false);

  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [error, setError] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      if (!containerRef.current) {
        return;
      }

      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const searchLocations = (query: string): void => {
    if (!MAPBOX_TOKEN) {
      setError("Mapbox access token is not configured.");
      return;
    }

    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setError("");
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async (): Promise<void> => {
      try {
        setIsSearching(true);
        setError("");

        const params = new URLSearchParams({
          q: query.trim(),
          access_token: MAPBOX_TOKEN,
          country: "IN",
          language: "en",
          limit: "8",
          autocomplete: "true",
          worldview: "in",
          types: "address,place,locality,neighborhood,street,district,region",
        });

        const response = await fetch(
          GEOCODING_URL + "/forward?" + params.toString(),
        );

        if (!response.ok) {
          const message = await response.text();

          console.error("Mapbox geocoding error:", response.status, message);

          throw new Error("Location search failed");
        }

        const data: GeocodingResponse = await response.json();

        const results = data.features || [];

        setSuggestions(results);

        setIsOpen(results.length > 0);

        setActiveIndex(-1);

        if (results.length === 0) {
          setError("No matching locations found.");
        }
      } catch (searchError) {
        console.error("Location search error:", searchError);

        setSuggestions([]);
        setIsOpen(false);

        setError("Unable to search locations right now.");
      } finally {
        setIsSearching(false);
      }
    }, 350);
  };

  const handleInputChange = (value: string): void => {
    setInputValue(value);

    if (selectedLocation) {
      onClear();
    }

    setError("");
    setActiveIndex(-1);

    searchLocations(value);
  };

  const selectLocation = (feature: GeocodingFeature): void => {
    const state = getStateName(feature);

    if (state.trim().toLowerCase() !== "odisha") {
      setError(
        "This location is outside Odisha. CityHop currently supports locations within Odisha only.",
      );

      setSuggestions([]);
      setIsOpen(false);

      return;
    }

    const selected = createLocationFromFeature(feature);

    if (!selected) {
      setError(
        "This location does not contain enough geographic information. Please choose another result.",
      );

      return;
    }

    setInputValue(selected.address);

    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
    setError("");

    onSelect(selected);
  };

  const useCurrentLocation = (): void => {
    if (!navigator.geolocation) {
      setError("Your browser does not support live location.");

      return;
    }

    if (!MAPBOX_TOKEN) {
      setError("Mapbox access token is not configured.");

      return;
    }

    setIsGettingLocation(true);
    setError("");
    setSuggestions([]);
    setIsOpen(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;

        const longitude = position.coords.longitude;

        try {
          const params = new URLSearchParams({
            longitude: longitude.toString(),

            latitude: latitude.toString(),

            access_token: MAPBOX_TOKEN,

            language: "en",
            country: "IN",
            limit: "1",
            worldview: "in",
          });

          const response = await fetch(
            GEOCODING_URL + "/reverse?" + params.toString(),
          );

          if (!response.ok) {
            const message = await response.text();

            console.error(
              "Mapbox reverse geocoding error:",
              response.status,
              message,
            );

            throw new Error("Reverse geocoding failed");
          }

          const data: GeocodingResponse = await response.json();

          const feature = data.features?.[0];

          if (!feature) {
            throw new Error("Current location not found");
          }

          const state = getStateName(feature);

          if (state.trim().toLowerCase() !== "odisha") {
            setError(
              "Your current location is outside Odisha. CityHop currently supports locations within Odisha only.",
            );

            return;
          }

          const selected = createLocationFromFeature(feature);

          if (!selected) {
            throw new Error("Unable to create location");
          }

          selected.latitude = latitude;

          selected.longitude = longitude;

          setInputValue(selected.address);

          setSuggestions([]);
          setIsOpen(false);
          setError("");

          onSelect(selected);
        } catch (locationError) {
          console.error("Current location error:", locationError);

          setError(
            "Unable to identify your current location. Please search for it manually.",
          );
        } finally {
          setIsGettingLocation(false);
        }
      },
      (locationError) => {
        setIsGettingLocation(false);

        if (locationError.code === locationError.PERMISSION_DENIED) {
          setError(
            "Location permission was denied. Allow location access and try again.",
          );

          return;
        }

        if (locationError.code === locationError.POSITION_UNAVAILABLE) {
          setError("Your current location could not be determined.");

          return;
        }

        if (locationError.code === locationError.TIMEOUT) {
          setError(
            "Getting your current location timed out. Please try again.",
          );

          return;
        }

        setError("Unable to get your current location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "ArrowDown" && suggestions.length > 0) {
      event.preventDefault();

      setActiveIndex((current) => {
        if (current >= suggestions.length - 1) {
          return 0;
        }

        return current + 1;
      });

      return;
    }

    if (event.key === "ArrowUp" && suggestions.length > 0) {
      event.preventDefault();

      setActiveIndex((current) => {
        if (current <= 0) {
          return suggestions.length - 1;
        }

        return current - 1;
      });

      return;
    }

    if (event.key === "Enter" && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault();

      selectLocation(suggestions[activeIndex]);

      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const getSuggestionSubtitle = (feature: GeocodingFeature): string => {
    const properties = feature.properties;

    if (!properties) {
      return "Location";
    }

    if (properties.place_formatted) {
      return properties.place_formatted;
    }

    if (properties.full_address) {
      return properties.full_address;
    }

    return "Location";
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-2 block text-sm font-bold text-[#33444E]">
        {label}
      </label>

      <div className="relative">
        {allowCurrentLocation ? (
          <MapPin
            size={19}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#6689A5]"
          />
        ) : (
          <Navigation
            size={19}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#6689A5]"
          />
        )}

        <input
          type="text"
          value={inputValue}
          onChange={(event) => handleInputChange(event.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className="h-14 w-full rounded-2xl border border-[#B9C6D0] bg-[#E8ECF3] pl-12 pr-14 text-sm font-semibold text-[#263640] outline-none transition placeholder:text-[#7B8991] focus:border-[#6689A5] focus:ring-2 focus:ring-[#A7BDD3]"
        />

        {allowCurrentLocation && (
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={isGettingLocation}
            aria-label="Use current location"
            title="Use current location"
            className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#A7BDD3] text-[#526F85] transition hover:bg-[#6689A5] hover:text-[#E8ECF3] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGettingLocation ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <LocateFixed size={18} />
            )}
          </button>
        )}

        {!allowCurrentLocation && isSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <LoaderCircle size={18} className="animate-spin text-[#6689A5]" />
          </div>
        )}
      </div>

      {selectedLocation && (
        <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-[#526F85]">
          <Check size={14} />

          <span>{selectedLocation.name}</span>
        </div>
      )}

      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-[88px] z-50 overflow-hidden rounded-2xl border border-[#B9C6D0] bg-[#E8ECF3] shadow-[0_20px_50px_rgba(38,54,64,0.15)]">
          <div className="border-b border-[#CBD3D6] px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#667680]">
              Location suggestions
            </p>
          </div>

          <div className="max-h-[320px] overflow-y-auto p-2">
            {suggestions.map((feature, index) => (
              <button
                key={feature.properties?.mapbox_id || feature.id || index}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();

                  selectLocation(feature);
                }}
                className={
                  "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition " +
                  (index === activeIndex
                    ? "bg-[#CBD3D6]"
                    : "hover:bg-[#D6DADB]")
                }
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#A7BDD3] text-[#526F85]">
                  <MapPin size={16} />
                </span>

                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-[#263640]">
                    {feature.properties?.name || "Location"}
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-[#667680]">
                    {getSuggestionSubtitle(feature)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isSearching && inputValue.trim().length >= 2 && !isOpen && (
        <div className="absolute left-0 right-0 top-[88px] z-40 rounded-2xl border border-[#B9C6D0] bg-[#E8ECF3] px-4 py-4 shadow-[0_20px_50px_rgba(38,54,64,0.12)]">
          <div className="flex items-center gap-3 text-sm font-semibold text-[#667680]">
            <Search size={16} className="animate-pulse text-[#6689A5]" />
            Searching locations...
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#D3C8B8] px-3 py-3 text-xs font-semibold leading-5 text-[#526F85]">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />

          <span>{error}</span>
        </div>
      )}

      {!selectedLocation && !error && inputValue.trim().length === 0 && (
        <p className="mt-2 text-xs text-[#667680]">
          Search and select a real location from the suggestions.
        </p>
      )}
    </div>
  );
}
