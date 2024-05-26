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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, ChevronRightIcon, Loader2, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

enum TournamentFormat {
  single_elimination = "single_elimination",
  double_elimination = "double_elimination",
  round_robin = "round_robin",
}

const tournamentFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Tournament name must be at least 2 characters.",
    })
    .max(30, {
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
    const intValue = parseInt(value);
    return (
      !isNaN(intValue) && intValue > 0 && (intValue & (intValue - 1)) === 0
    );
  }, "Max teams must be a positive power of 2."),
  max_team_size: z.string().refine((value) => {
    return !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
  }, "Max team size must be a positive number."),
  min_team_size: z.string().refine((value) => {
    return !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
  }, "Min team size must be a positive number."),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  visibility: z.boolean(),
});

type TournamentFormValues = z.infer<typeof tournamentFormSchema>;

export default function CreateTournamentPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { getToken } = useAuth();
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

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

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

    try {
      setLoading(true);
      const response = await createTournament(
        formData,
        getToken,
        invalidateQueries,
      );

      toast({
        title: "Success!",
        description: `The tournament ${response.name} has been created.`,
      });

      setTimeout(() => {
        navigate(`/dashboard/tournaments/${response.id}`);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
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

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            Dashboard
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            <Link to="/dashboard/tournaments">Your Tournaments</Link>
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="font-medium text-foreground">Create</div>
        </div>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Create Tournament
          </h1>
          <p className="pb-2 text-xl text-muted-foreground">
            Create your tournament and start competing with your friends !
          </p>
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
                    <Textarea
                      placeholder="Describe your tournament..."
                      {...field}
                    />
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
                      <FormLabel>Max Teams x^2 (Required)</FormLabel>
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
              {loading ? (
                <Button type="submit" disabled>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </Button>
              ) : (
                <Button type="submit">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Tournament
                </Button>
              )}
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
