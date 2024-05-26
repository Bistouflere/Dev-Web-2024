import { toast } from "../ui/use-toast";
import { teamUsersQueryOptions } from "@/api/teams";
import { tournamentUsersQueryOptions } from "@/api/tournaments";
import { addUserToTournament } from "@/api/userActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { Loader2, UserPlus } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

const FormSchema = z.object({
  user_id: z.string({
    required_error: "Please select a user",
  }),
});

export function TeamTournamentUserRegister() {
  const { searchTeamId, searchTournamentId } = useParams();
  const { userId, getToken } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { data: tournamentUsers } = useQuery(
    tournamentUsersQueryOptions(searchTournamentId || ""),
  );
  const { data: teamUsers } = useQuery(
    teamUsersQueryOptions(searchTeamId || ""),
  );

  const registerableUsers = teamUsers?.filter(
    (teamUser) =>
      !tournamentUsers?.find(
        (tournamentUser) => tournamentUser.id === teamUser.id,
      ),
  );

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  const handleRegister = async (data: z.infer<typeof FormSchema>) => {
    try {
      setLoading(true);
      await addUserToTournament(
        data.user_id,
        searchTournamentId || "",
        searchTeamId || "",
        getToken,
        invalidateQueries,
      );
      toast({
        title: "Success!",
        description: `You have successfully registered the user for the tournament.`,
      });

      setTimeout(() => {
        setLoading(false);
      }, 200);
    } catch (error) {
      setLoading(false);
      console.error("Error registering user:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          (error as Error).message ||
          `An error occurred while registering the user for the tournament.`,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={!userId} className="h-8 px-2 lg:px-3">
          <UserPlus className="mr-2 h-5 w-5" />
          Register Users
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Which user would you like to register for the tournament?
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRegister)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {registerableUsers?.length ? (
                        registerableUsers?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.username}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="disabled" disabled>
                          You do not have any users to register for this
                          tournament.
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {loading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Register User
              </Button>
            ) : (
              <Button type="submit">
                <UserPlus className="mr-2 h-5 w-5" />
                Register User
              </Button>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
