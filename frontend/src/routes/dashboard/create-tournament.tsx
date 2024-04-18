import { gamesQueryOptions } from "@/api/games";
import { createTournament } from "@/api/userActions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
<<<<<<< Updated upstream
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, ChevronRightIcon } from "lucide-react";
import { useCallback } from "react";
=======
import { addDays, format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronRightIcon,
  ChevronsUpDown,
} from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";
>>>>>>> Stashed changes
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

<<<<<<< Updated upstream
enum TournamentFormat {
  single_elimination = "single_elimination",
  double_elimination = "double_elimination",
  round_robin = "round_robin",
}

const tournamentFormSchema = z.object({
  name: z
    .string()
=======
const games = [
  { label: "League Of Legends", value: "1" },
  { label: "Counter-Strike: Global Offensive", value: "2" },
  { label: "Fortnite", value: "3" },
  { label: "Valorant", value: "4" },
  { label: "Rocket League", value: "5" },
  { label: "Apex Legends", value: "6" },
  { label: "Fifa 24", value: "7" },
  { label: "Overwatch", value: "8" },
  { label: "Brawl Stars", value: "9" },
] as const;

const profileFormSchema = z.object({
  name: z
    .string({
      required_error: "Please give a name.",
    })
>>>>>>> Stashed changes
    .min(2, {
      message: "Tournament name must be at least 2 characters.",
    })
    .max(30, {
<<<<<<< Updated upstream
      message: "Tournament name must not be longer than 30 characters.",
    })
    .trim(),
  description: z
    .string()
    .max(160, {
      message: "Tournament description must not be longer than 160 characters.",
    })
    .trim()
    .optional(),
  file: z.instanceof(File).optional(),
  game: z.string().refine((value) => {
    return value.length > 0;
  }, "Game must be selected."),
  format: z.nativeEnum(TournamentFormat),
  tags: z.string().optional(),
  cash_prize: z.string().refine((value) => {
    return !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
  }, "Cash prize must be a positive number."),
  max_teams: z.string().refine((value) => {
    return !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
  }, "Max teams must be a positive number."),
  max_team_size: z.string().refine((value) => {
    return !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
  }, "Max team size must be a positive number."),
  min_team_size: z.string().refine((value) => {
    return !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
  }, "Min team size must be a positive number."),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  visibility: z.boolean(),
=======
      message: "Username must not be longer than 30 characters.",
    }).optional(),
  description: z.string().max(160).min(4).optional(),
  image_url: z.string().optional(),
  game_id: z.string({
    required_error: "Please select a game.",
  }).optional(),
  format: z.string({
    // required_error: "Please select a format.",
  }).optional(),
  visibility: z.string().optional(),
  cash_prize: z.string().optional(),
  max_teams: z.string({
    required_error: "Please specify the number max for teams.",
  }).optional(),
  // .min(5, {
  //     message: "Number of players must be at least 5. (5 players for a 5v5 game)",
  // })
  // .max(7, {
  //     message: "Number of players must not exceed 7. (5 players + 2 subs for a 5v5 game)",
  // }),
  max_team_size: z
    .string({
      required_error: "Please specify the number max of teams.",
    }).optional(),
  // .min(1, {
  //   message: "Number of slots must be at least 1.",
  // })
  // .max(16, {
  //   message: "Number of slots must not exceed 16.",
  // }).optional(),
  min_team_size: z
    .string({
      required_error: "Please specify the number max of teams.",
    }).optional(),
  start_date: z.string({
    // required_error: "Please give the start date.",
  }).optional(),
  end_date: z.string({
    // required_error: "Please give the end date.",
  }).optional(),
>>>>>>> Stashed changes
});

type TournamentFormValues = z.infer<typeof tournamentFormSchema>;

export default function CreateTournamentPage() {
  const navigate = useNavigate();
  const { userId, getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: games } = useQuery(gamesQueryOptions());

  const form = useForm<TournamentFormValues>({
    defaultValues: {
      name: "",
      description: "",
      file: undefined,
      game: "",
      format: TournamentFormat.single_elimination,
      tags: "",
      cash_prize: "0",
      max_teams: "32",
      max_team_size: "5",
      min_team_size: "1",
      visibility: true,
    },
    mode: "onChange",
    resolver: zodResolver(tournamentFormSchema),
  });

<<<<<<< Updated upstream
  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [`tournaments`] });
    queryClient.invalidateQueries({
      queryKey: [`tournaments_users_${userId}`],
=======
  function onSubmit(data: ProfileFormValues) {
    console.log(data);
  
    const formData = {
      name: data.name,
      description: data.description,
      image_url: data.image_url,
      format: data.format,
      visibility: data.visibility,
      start_date: data.start_date,
      cash_prize: data.cash_prize,
      max_teams: data.max_teams,
      max_team_size: data.max_team_size,
      min_team_size: data.min_team_size,
      // game_name: data.game_name,
    };
  
    fetch('/api/tournaments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create tournament');
      }
      return response.json();
    })
    .then(data => {
      console.log('Tournament created:', data);
      toast({
        title: "Your tournament is created !",
      });
    })
    .catch(error => {
      console.error('Error creating tournament:', error);
      toast({
        title: "Failed to create tournament",
      });
>>>>>>> Stashed changes
    });
  }, [queryClient, userId]);

  const onSubmit = async (data: TournamentFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name.trim());
    formData.append("description", data.description?.trim() ?? "");
    if (data.file) formData.append("file", data.file);
    formData.append("game", data.game);
    formData.append("format", data.format);
    formData.append("tags", data.tags ?? "");
    formData.append("cash_prize", data.cash_prize.toString());
    formData.append("max_teams", data.max_teams.toString());
    formData.append("max_team_size", data.max_team_size.toString());
    formData.append("min_team_size", data.min_team_size.toString());
    if (data.start_date)
      formData.append("start_date", data.start_date.toISOString());
    if (data.end_date) formData.append("end_date", data.end_date.toISOString());
    formData.append("visibility", data.visibility?.toString() ?? "false");

<<<<<<< Updated upstream
    try {
      const response = await createTournament(
        formData,
        getToken,
        invalidateQueries,
      );

      toast({
        title: "Success!",
        description: `The tournament ${response.name} has been created.`,
      });

      navigate(`/dashboard/tournaments/${response.id}`);
    } catch (error) {
      console.error("Error creating tournament:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          (error as Error).message ||
          `An error occurred while creating your tournament.`,
      });
    }
  };
=======
  const [start_date, setStartDate] = React.useState<Date>()
  const [end_date, setEndDate] = React.useState<Date>()
>>>>>>> Stashed changes

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            Dashboard
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="font-medium text-foreground">Create Tournament</div>
        </div>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Create Tournament
          </h1>
          <p className="pb-2 text-xl text-muted-foreground">
            Create your tournament and start competing with your friends !
          </p>
<<<<<<< Updated upstream
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Required)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Give your tournament a name..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed to other users.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
=======
        </div>
        <br />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormDescription>
              Fields marked with * are required.
            </FormDescription>

            <FormField
              control={form.control}
              name="name"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
>>>>>>> Stashed changes
                    <Textarea
                      placeholder="Describe your tournament..."
                      {...field}
                    />
<<<<<<< Updated upstream
                    <FormDescription>
                      This is the description that will be displayed to other
                      users.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <Input
                      type="text"
                      placeholder="Tags, separated by commas..."
                      {...field}
                    />
                    <FormDescription>
                      These are the tags that will be used to find your
                      tournament.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file"
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        {...fieldProps}
                        onChange={(event) => {
                          onChange(event.target.files && event.target.files[0]);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the image that will be displayed to other users.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col md:flex-row md:gap-10">
                <FormField
                  control={form.control}
                  name="game"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game (Required)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a game for your tournament" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {games &&
                            games.map((game) => (
                              <SelectItem key={game.id} value={game.id}>
                                {game.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This is the game that will be played in your tournament.
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
                      <FormLabel>Format (Required)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a format for your tournament" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(TournamentFormat).map((format) => (
                            <SelectItem key={format} value={format}>
                              {format}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This is the format that will be used for your
                        tournament.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cash_prize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cash Prize (Required)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the cash prize that will be awarded to the
                        winning team.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col md:flex-row md:gap-10">
                <FormField
                  control={form.control}
                  name="max_teams"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Teams (Required)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the maximum number of teams that can join your
                        tournament.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="max_team_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Team Size (Required)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the maximum number of players per team.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="min_team_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Team Size (Required)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the minimum number of players per team.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col md:flex-row md:gap-10">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        This is the date your tournament will start.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        This is the date your tournament will end.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Public</FormLabel>
                      <FormDescription>
                        Should everyone be able to join your tournament?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit">Create Tournament</Button>
            </form>
          </Form>
        </div>
=======
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                  <FormLabel htmlFor="picture">Picture</FormLabel>
                  <Input id="picture" type="file" {...field} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="game_id"
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
                                className={`${game.value === field.value ? "font-bold" : ""
                                  } ${hoveredGameIndex === index ? "font-bold" : ""
                                  } data-[disabled]:pointer-events-auto`}
                                value={game.label}
                                key={game.value}
                                onMouseEnter={() => setHoveredGameIndex(index)}
                                onMouseLeave={() => setHoveredGameIndex(null)}
                                onSelect={() => {
                                  form.setValue("game_id", game.value);
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
              name="visibility"
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
              name="max_team_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Team Size *</FormLabel>
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
              name="min_team_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Team Size *</FormLabel>
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
              name="start_date"
              render={() => (
                <FormItem>
                  <FormLabel>Start date *</FormLabel>
                  <div className={cn("grid gap-2")}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !start_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {start_date ? format(start_date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={start_date}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={() => (
                <FormItem>
                  <FormLabel>End date *</FormLabel>
                  <div className={cn("grid gap-2")}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !end_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {end_date ? format(end_date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={end_date}
                          onSelect={setEndDate}
                          initialFocus
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
>>>>>>> Stashed changes
      </div>
    </main>
  );
}
