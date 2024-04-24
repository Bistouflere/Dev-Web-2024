import { toast } from "../ui/use-toast";
import { tournamentTeamsQueryOptions } from "@/api/tournaments";
import { addTeamToTournament } from "@/api/userActions";
import { userTeamsQueryOptions } from "@/api/users";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, ShieldPlus } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

const FormSchema = z.object({
  team_id: z.string({
    required_error: "Please select a team",
  }),
});

export function TournamentTeamRegister() {
  const { searchTournamentId } = useParams();
  const { userId, getToken } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { data: tournamentTeams } = useQuery(
    tournamentTeamsQueryOptions(searchTournamentId || ""),
  );
  const { data: userTeams } = useQuery(userTeamsQueryOptions(userId));

  const registerableTeams = userTeams?.filter(
    (userTeam) =>
      !tournamentTeams?.some(
        (tournamentTeam) => tournamentTeam.id === userTeam.id,
      ) && userTeam.team_role !== "participant",
  );

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [`teams`],
    });
    queryClient.invalidateQueries({
      queryKey: [`team_tournaments`],
    });
    queryClient.invalidateQueries({
      queryKey: [`tournaments`],
    });
    queryClient.invalidateQueries({
      queryKey: [`tournament_teams`],
    });
  }, [queryClient]);

  const handleRegister = async (data: z.infer<typeof FormSchema>) => {
    try {
      setLoading(true);
      await addTeamToTournament(
        data.team_id,
        searchTournamentId || "",
        getToken,
        invalidateQueries,
      );
      toast({
        title: "Success!",
        description: `You have successfully registered your team for the tournament.`,
      });

      setTimeout(() => {
        setLoading(false);
      }, 200);
    } catch (error) {
      setLoading(false);
      console.error("Error registering team:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          (error as Error).message ||
          `An error occurred while registering your team for the tournament.`,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={!userId}>
          <ShieldPlus className="mr-2 h-5 w-5" />
          Register Team
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Which team would you like to register for the tournament?
          </DialogTitle>
          <DialogDescription>
            You can then add or remove members to this tournament by visiting
            your team dashboard.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRegister)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="team_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {registerableTeams?.length ? (
                        registerableTeams?.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="disabled" disabled>
                          You do not have any teams to register for this
                          tournament.
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    You can only register a team you are the owner or manager
                    of.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {loading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Register Team
              </Button>
            ) : (
              <Button type="submit">
                <ShieldPlus className="mr-2 h-5 w-5" />
                Register Team
              </Button>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
