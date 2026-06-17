import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CountryOption {
  code: string;
  flag: string;
  dialCode: string;
  name: string;
}

export const COUNTRIES: CountryOption[] = [
  { code: "GH", flag: "🇬🇭", dialCode: "+233", name: "Ghana" },
  { code: "NG", flag: "🇳🇬", dialCode: "+234", name: "Nigeria" },
  { code: "TG", flag: "🇹🇬", dialCode: "+228", name: "Togo" },
  { code: "CI", flag: "🇨🇮", dialCode: "+225", name: "Ivory Coast" },
  { code: "KE", flag: "🇰🇪", dialCode: "+254", name: "Kenya" },
  { code: "GB", flag: "🇬🇧", dialCode: "+44", name: "United Kingdom" },
  { code: "US", flag: "🇺🇸", dialCode: "+1", name: "United States" },
];

interface PhoneInputProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
  placeholder?: string;
}

export function PhoneInput({
  value = "",
  onChange,
  className,
  disabled = false,
  id,
  placeholder = "50 000 0000",
}: PhoneInputProps) {
  // Find which country prefix is used in the value
  const matchedCountry = React.useMemo(() => {
    // Trim leading whitespace
    const val = value.trim();
    if (!val) return COUNTRIES[0]; // Default to Ghana

    // Check dial codes from longest to shortest to avoid partial match conflicts
    const sortedCountries = [...COUNTRIES].sort(
      (a, b) => b.dialCode.length - a.dialCode.length
    );

    for (const c of sortedCountries) {
      if (val.startsWith(c.dialCode)) {
        return c;
      }
    }
    return COUNTRIES[0]; // Fallback to Ghana
  }, [value]);

  const [selectedCountry, setSelectedCountry] = React.useState<CountryOption>(matchedCountry);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Sync selectedCountry if value changes externally
  React.useEffect(() => {
    setSelectedCountry(matchedCountry);
  }, [matchedCountry]);

  // Extract the local phone number digits
  const localNumber = React.useMemo(() => {
    if (!value) return "";
    if (value.startsWith(selectedCountry.dialCode)) {
      return value.slice(selectedCountry.dialCode.length).trim();
    }
    // If the value doesn't match the selected country prefix, just return value
    return value;
  }, [value, selectedCountry]);

  const handleCountrySelect = (country: CountryOption) => {
    setSelectedCountry(country);
    setIsOpen(false);
    // Trigger change with new dialCode + existing local digits
    const cleanedLocal = localNumber.replace(/[^0-9]/g, "");
    onChange(`${country.dialCode}${cleanedLocal}`);
  };

  const handlePhoneDigitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value;
    // Allow digits and basic spacing for readability
    const cleanedDigits = rawDigits.replace(/[^0-9]/g, "");
    onChange(`${selectedCountry.dialCode}${cleanedDigits}`);
  };

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "flex rounded-md border border-input bg-background text-sm shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring focus-within:border-ring overflow-hidden h-9 w-full",
        disabled && "opacity-50 cursor-not-allowed bg-muted",
        className
      )}
    >
      {/* Country Selector Dropdown Trigger */}
      <div className="relative flex items-center h-full">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 h-full border-r border-input hover:bg-muted/50 transition-colors text-secondary font-medium focus:outline-none"
        >
          <span className="text-base leading-none select-none">{selectedCountry.flag}</span>
          <span className="text-[11px] leading-none select-none">{selectedCountry.dialCode}</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-1.5 w-52 rounded-xl border bg-card text-card-foreground shadow-elegant z-50 py-1.5 animate-in fade-in slide-in-from-top-1">
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => handleCountrySelect(c)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-muted/80 transition-colors font-semibold",
                  selectedCountry.code === c.code && "bg-primary/5 text-primary"
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">{c.flag}</span>
                  <span>{c.name}</span>
                </span>
                <span className="text-muted-foreground font-medium">{c.dialCode}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Local Digits Input */}
      <input
        id={id}
        type="tel"
        disabled={disabled}
        value={localNumber}
        onChange={handlePhoneDigitsChange}
        placeholder={placeholder}
        className="flex-1 px-3 py-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none w-full min-w-0"
      />
    </div>
  );
}
