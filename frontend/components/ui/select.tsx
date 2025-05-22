// 'use client';

import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { countries } from '@/lib/countries';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface SelectComponentProps {
  // newUser: NewUser | UpdUser;
  newUser: any;
  // setNewUser: React.Dispatch<React.SetStateAction<NewUser | UpdUser>>;
  setNewUser: React.Dispatch<React.SetStateAction<any>>;
}

const SelectComponent = ({ newUser, setNewUser }: SelectComponentProps) => {
  const pathname = usePathname();
  const [searchCountry, setSearchCountry] = useState<string>('');
  const [searchedCountries, setSearchedCountries] = useState(countries);

  const handleSearchCountry = (value: string) => {
    setSearchCountry(value);
    const newList = countries.filter((item) =>
      item.name.toLowerCase().startsWith(value.toLowerCase())
    );
    setSearchedCountries(newList);
  };

  const handleChange = (value: string) => {
    setNewUser({ ...newUser, country: value });
    setSearchCountry('');
    setSearchedCountries(countries);
  };

  return (
    <Select.Root value={newUser?.country} onValueChange={handleChange}>
      <Select.Trigger
        color="indigo"
        className={`triggerBtn flex justify-between items-center w-full focus-visible: ${
          pathname !== '/account'
            ? 'outline-blue-300 p-2 bg-amber-100'
            : 'outline-none'
        }`}
        style={{ padding: pathname === '/account' ? '4px 8px' : '8px' }}
      >
        <Select.Value placeholder="Country" aria-label={newUser?.country}>
          {/* {newUser.country && ( */}
          <div className="flex items-center gap-3">
            <p>
              {countries.filter((el) => el.name === newUser?.country)[0]
                ?.emoji || ''}
            </p>
            <p>{newUser?.country}</p>
          </div>
          {/* // )} */}
        </Select.Value>
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="selectContentWidth bg-white h-44 overflow-hidden rounded shadow-md border-1 border-gray-300"
          position="popper"
          sideOffset={2}
        >
          <Select.Viewport className="p-2">
            <input
              placeholder="Search country"
              value={searchCountry}
              onChange={(e) => handleSearchCountry(e.target.value)}
              className="fixed left-0 top-0 w-full bg-slate-100 border-1 border-gray-300 px-2 py-1 rounded outline-blue-300 mb-1"
            />
            {searchedCountries.map((country) => (
              <Select.Item
                key={country.code}
                className="p-2 hover:bg-gray-100 cursor-pointer outline-none flex items-center gap-2"
                value={country.name}
              >
                <Select.ItemText>
                  <div className="flex items-center gap-4">
                    <p>{country.emoji}</p> <p>{country.name}</p>
                  </div>
                </Select.ItemText>
                <Select.ItemIndicator>
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default SelectComponent;
