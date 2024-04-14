import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronRightIcon,
  ChevronsUpDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import Balancer from "react-wrap-balancer";
import { z } from "zod";

const games = [
  { label: "League Of Legends", value: "lol" },
  { label: "Counter-Strike: Global Offensive", value: "csgo" },
  { label: "Fortnite", value: "fortnite" },
  { label: "Valorant", value: "valorant" },
  { label: "Rocket League", value: "rocketLeague" },
  { label: "Apex Legends", value: "apex" },
  { label: "Fifa 24", value: "fifa" },
  { label: "Overwatch", value: "overwatch" },
  { label: "Brawl Stars", value: "brawlStars" },
] as const;

const profileFormSchema = z.object({
  username: z
    .string({
      required_error: "Please give a name.",
    })
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  bio: z.string().max(160).min(4).optional(),
  picture: z.string().optional(),
  game: z.string({
    required_error: "Please select a game.",
  }),
  format: z.string({
    required_error: "Please select a format.",
  }),
  cash_prize: z.string().optional(),
  max_teams: z
    .string({
      required_error: "Please specify the number max for teams.",
    })
    .min(5, {
      message:
        "Number of players must be at least 5. (5 players for a 5v5 game)",
    })
    .max(7, {
      message:
        "Number of players must not exceed 7. (5 players + 2 subs for a 5v5 game)",
    }),
  team_size: z
    .string({
      required_error: "Please specify the number max of teams.",
    })
    .min(1, {
      message: "Number of slots must be at least 1.",
    })
    .max(16, {
      message: "Number of slots must not exceed 16.",
    }),
  dates: z.string({
    required_error: "Please give the dates.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function CreateTournamentPage() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    console.log(data);

    toast({
      title: "Your tournament is created !",
    });
  }

  const [hoveredGameIndex, setHoveredGameIndex] = useState<number | null>(null);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  useEffect(() => {
    const interval = setInterval(
      () => {
        setDate((prevDate) => ({
          from: prevDate?.from,
          to: addDays(new Date(), 7),
        }));
      },
      24 * 60 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            Dashboard
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="font-medium text-foreground">
            Create My Tournament
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Create My Tournament
          </h1>
          <p className="text-lg text-muted-foreground">
            <Balancer>This is the protected tournament creation page.</Balancer>
          </p>
        </div>
        <br />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormDescription>
              Fields marked with * are required.
            </FormDescription>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Give a name at your tournament !"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the public name under which you will be displayed
                    during the tournament. Please note that this name cannot be
                    changed once chosen.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about your tournament..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="picture"
              render={({ field }) => (
                <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                  <FormLabel htmlFor="picture">Picture</FormLabel>
                  <Input id="picture" type="file" {...field} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="game"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Game *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? games.find((games) => games.value === field.value)
                                ?.label
                            : "Select a game"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search a game..." />
                        <CommandList>
                          <CommandEmpty>No game found.</CommandEmpty>
                          <CommandGroup>
                            {games.map((game, index) => (
                              <CommandItem
                                className={`${
                                  game.value === field.value ? "font-bold" : ""
                                } ${
                                  hoveredGameIndex === index ? "font-bold" : ""
                                } data-[disabled]:pointer-events-auto`}
                                value={game.label}
                                key={game.value}
                                onMouseEnter={() => setHoveredGameIndex(index)}
                                onMouseLeave={() => setHoveredGameIndex(null)}
                                onSelect={() => {
                                  form.setValue("game", game.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    game.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {game.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This will be the game played in this tournament.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Format *</FormLabel>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a format" {...field} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single_elimination">
                        Single Elimination
                      </SelectItem>
                      <SelectItem value="double_elimination">
                        Double Elimination
                      </SelectItem>
                      <SelectItem value="round_robin">Round Robin</SelectItem>
                      <SelectItem value="swiss">Swiss</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="format"
              render={() => (
                <FormItem>
                  <FormLabel>Public *</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="true">Yes</Label>
                    <Switch />
                    <Label htmlFor="false">No</Label>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cash_prize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cash Prize (En €)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter the cash prize for the tournament."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_teams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Teams *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      placeholder="Enter the max of teams for the tournament."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="team_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Size *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      placeholder="Enter the team size for the tournament."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dates"
              render={() => (
                <FormItem>
                  <FormLabel>Dates *</FormLabel>
                  <div className={cn("grid gap-2")}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date?.from ? (
                            date.to ? (
                              <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(date.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={date?.from}
                          selected={date}
                          onSelect={setDate}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit">Create My Team</Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
