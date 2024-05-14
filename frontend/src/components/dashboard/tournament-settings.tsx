import { gamesQueryOptions } from "@/api/games";
import { tournamentQueryOptions } from "@/api/tournaments";
import { deleteTournament, updateTournament } from "@/api/userActions";
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
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Pencil, Trash } from "lucide-react";
import { CalendarIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

enum TournamentFormat {
  single_elimination = "single_elimination",
  double_elimination = "double_elimination",
  round_robin = "round_robin",
}

enum TournamentVisibility {
  public = "public",
  private = "private",
}

function getVisibility(visibility: boolean): TournamentVisibility {
  return visibility
    ? TournamentVisibility.public
    : TournamentVisibility.private;
}

function getVisibilityValue(visibility: TournamentVisibility): boolean {
  return visibility === TournamentVisibility.public;
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

export function DashboardTournamentSettings() {
  const { searchTournamentId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tournament } = useSuspenseQuery(
    tournamentQueryOptions(searchTournamentId || ""),
  );

  const { data: games } = useSuspenseQuery(gamesQueryOptions());

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  const form = useForm<TournamentFormValues>({
    defaultValues: {
      name: tournament.name,
      description: tournament.description || "",
      file: undefined,
      game: tournament.game_id,
      format: tournament.format as TournamentFormat,
      tags: tournament.tags.join(", "),
      cash_prize: tournament.cash_prize?.toString(),
      max_teams: tournament.max_teams.toString(),
      max_team_size: tournament.max_team_size.toString(),
      min_team_size: tournament.min_team_size.toString(),
      start_date: tournament.start_date
        ? new Date(tournament.start_date)
        : undefined,
      end_date: tournament.end_date ? new Date(tournament.end_date) : undefined,
      visibility: getVisibilityValue(
        tournament.visibility as TournamentVisibility,
      ),
    },
    values: {
      name: tournament.name,
      description: tournament.description || "",
      file: undefined,
      game: tournament.game_id,
      format: tournament.format as TournamentFormat,
      tags: tournament.tags.join(", "),
      cash_prize: tournament.cash_prize?.toString() || "",
      max_teams: tournament.max_teams.toString(),
      max_team_size: tournament.max_team_size.toString(),
      min_team_size: tournament.min_team_size.toString(),
      start_date: tournament.start_date
        ? new Date(tournament.start_date)
        : undefined,
      end_date: tournament.end_date ? new Date(tournament.end_date) : undefined,
      visibility: getVisibilityValue(
        tournament.visibility as TournamentVisibility,
      ),
    },
    mode: "onChange",
    resolver: zodResolver(tournamentFormSchema),
  });

  const onSubmit = async (data: TournamentFormValues) => {
    if (
      data.name === tournament.name &&
      data.description === tournament.description &&
      data.game === tournament.game_id &&
      data.format === tournament.format &&
      data.tags === tournament.tags.join(", ") &&
      data.cash_prize === tournament.cash_prize?.toString() &&
      data.max_teams === tournament.max_teams.toString() &&
      data.max_team_size === tournament.max_team_size.toString() &&
      data.min_team_size === tournament.min_team_size.toString() &&
      data.start_date ===
        (tournament.start_date ? new Date(tournament.start_date) : undefined) &&
      data.end_date ===
        (tournament.end_date ? new Date(tournament.end_date) : undefined) &&
      getVisibility(data.visibility) === tournament.visibility &&
      !data.file
    ) {
      toast({
        variant: "destructive",
        title: "No changes detected.",
        description: `No changes were detected in your tournament details.`,
      });
      return;
    }

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
      const response = await updateTournament(
        tournament.id,
        formData,
        getToken,
        invalidateQueries,
      );

      toast({
        title: "Success!",
        description: `${response.name} has been updated.`,
      });

      setTimeout(() => {
        navigate(`/dashboard/tournaments/${response.id}`);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error("Error updating tournament:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          (error as Error).message ||
          `An error occurred while updating your tournament.`,
      });
    }
  };

  async function handleDeleteTournament() {
    if (!window.confirm("Are you sure you want to delete this tournament?"))
      return;

    try {
      setLoading(true);
      await deleteTournament(tournament.id, getToken, invalidateQueries);
      toast({
        title: "Success!",
        description: `${tournament.name} has been deleted.`,
      });

      setTimeout(() => {
        navigate("/dashboard/tournaments");
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error("Error deleting tournament:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          (error as Error).message ||
          `An error occurred while deleting your tournament.`,
      });
    }
  }

  return (
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
              <Textarea placeholder="Describe your tournament..." {...field} />
              <FormDescription>
                This is the description that will be displayed to other users.
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
                These are the tags that will be used to find your tournament.
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
                  This is the format that will be used for your tournament.
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
                  This is the cash prize that will be awarded to the winning
                  team.
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
        <div className="flex justify-between">
          {loading ? (
            <Button type="submit" disabled>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </Button>
          ) : (
            <Button type="submit">
              <Pencil className="mr-2 h-5 w-5" />
              Edit Tournament
            </Button>
          )}
          {loading ? (
            <Button
              type="button"
              variant="destructive"
              disabled
              className="ml-2"
            >
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </Button>
          ) : (
            <Button
              type="button"
              variant="destructive"
              className="ml-2"
              onClick={() => handleDeleteTournament()}
            >
              <Trash className="mr-2 h-5 w-5" />
              Delete Tournament
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
