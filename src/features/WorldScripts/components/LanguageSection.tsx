import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { selectFilteredLanguages, selectLanguage, useWorldScriptsStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function LanguageSection() {
  const selectedId = useWorldScriptsStore((s) => s.selectedId);
  const pickerOpen = useWorldScriptsStore((s) => s.pickerOpen);
  const setSelectedId = useWorldScriptsStore((s) => s.setSelectedId);
  const setPickerOpen = useWorldScriptsStore((s) => s.setPickerOpen);
  const browseScript = useWorldScriptsStore((s) => s.browseScript);
  const browseKind = useWorldScriptsStore((s) => s.browseKind);
  const browseDirection = useWorldScriptsStore((s) => s.browseDirection);
  const selected = selectLanguage(selectedId);
  const languages = selectFilteredLanguages({ browseScript, browseKind, browseDirection });

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Language</SectionHeading>

      <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={pickerOpen}
              className="h-auto w-full justify-between rounded-none px-3 py-2.5 text-left"
            />
          }
        >
          <span className="min-w-0 flex-1 truncate">
            <span className="block text-sm font-medium">{selected.name}</span>
            <span className="mt-0.5 block font-mono text-[11px] text-muted-foreground">
              {selected.native} · {selected.script}
            </span>
          </span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] rounded-none p-0" align="start">
          <Command>
            <CommandInput placeholder="Search any language..." />
            <CommandList>
              <CommandEmpty>No language matches filters.</CommandEmpty>
              <CommandGroup>
                {languages.map((lang) => (
                  <CommandItem
                    key={lang.id}
                    value={`${lang.name} ${lang.native} ${lang.script}`}
                    onSelect={() => setSelectedId(lang.id)}
                    className="cursor-pointer"
                  >
                    <Check className={cn('mr-2 size-4', selectedId === lang.id ? 'opacity-100' : 'opacity-0')} />
                    <span className="flex-1">{lang.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{lang.script}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </section>
  );
}
