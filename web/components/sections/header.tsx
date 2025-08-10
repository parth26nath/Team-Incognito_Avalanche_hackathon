"use client";

import React from "react";
import Image from "next/image";
import Logo from "@/assets/Logo.png";
import { Button } from "@/components/ui/button";
import { useDisconnectWallet } from "@/components/ui/connectButton";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface HeaderProps {
  onFilterChange: (filterType: string, value: string) => void;
}

export const Header = ({ onFilterChange }: HeaderProps) => {
  const router = useRouter();
  const disconnectWallet = useDisconnectWallet();

  const handleLogout = () => {
    disconnectWallet();
    localStorage.removeItem("token");
    router.push("/test");
  };

  return (
    <section className="flex justify-center items-center w-full">
      <div className="flex justify-between items-center w-full p-4">
        <div className="flex items-center gap-4">
          <Link
            href={"/"}
            style={{
              display: "flex",
            }}
            className=" flex-row gap-2 align-items-center"
          >
            <Image src={Logo} alt="Logo" className="w-12 h-12" />
            <div className="flex flex-col items-start">
              <div className="text-2xl font-nunito font-bold">{`Let's Talk`}</div>
              <div className="text-xs font-thin flex justify-center items-center gap-2">
                <div>243 listeners online</div>
                <div className="w-[8px] h-[8px] bg-green-500 rounded-full"></div>
              </div>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <FilterSelect
            options={[
              { value: "", label: "Expertise" },
              { value: "relationships", label: "Relationships" },
              { value: "anxiety", label: "Anxiety" },
              { value: "depression", label: "Depression" },
              { value: "stress", label: "Stress" },
            ]}
            onChange={(value) => onFilterChange("expertise", value)}
          />

          <FilterSelect
            options={[
              { value: "", label: "Languages" },
              { value: "english", label: "English" },
              { value: "spanish", label: "Spanish" },
              { value: "french", label: "French" },
            ]}
            onChange={(value) => onFilterChange("language", value)}
          />

          <FilterSelect
            options={[
              { value: "", label: "Rating" },
              { value: "5", label: "5 Stars" },
              { value: "4", label: "4+ Stars" },
              { value: "3", label: "3+ Stars" },
            ]}
            onChange={(value) => onFilterChange("rating", value)}
          />

          <Button
            variant="secondary"
            size="lg"
            className="mt-4 bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </section>
  );
};

interface FilterSelectProps {
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

const FilterSelect = ({ options, onChange }: FilterSelectProps) => (
  <select
    className="mt-4 px-4 py-2 rounded-lg bg-white text-black font-bold hover:bg-gradient-to-r from-orange-400 to-pink-400 transition-colors"
    onChange={(e) => onChange(e.target.value)}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
