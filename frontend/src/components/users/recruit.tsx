import { inviteUser } from "@/api/userActions";
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
import { toast } from "@/components/ui/use-toast";
import { User } from "@/types/apiResponses";
import { useAuth } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, UserPlus } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  team_id: z.string({
    required_error: "Please select a team",
  }),
});

export function UserRecruit({
  user,
  userId,
}: {
  user: User;
  userId: string | null | undefined;
}) {
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [`user_teams`],
    });
    queryClient.invalidateQueries({
      queryKey: [`user_invitations`],
    });
  }, [queryClient]);

  const handleRecruit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setLoading(true);
      await inviteUser(user.id, data.team_id, getToken, invalidateQueries);
      toast({
        title: "Success!",
        description: `You have sent a recruitment request to ${user?.username}.`,
      });

      setTimeout(() => {
        setLoading(false);
      }, 200);
    } catch (error) {
      setLoading(false);
      console.error("Error recruiting user:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          (error as Error).message ||
          `An error occurred while recruiting ${user?.username}.`,
      });
    }
  };

  const { data: recruiterTeams } = useQuery(userTeamsQueryOptions(userId));
  const { data: userTeams } = useQuery(userTeamsQueryOptions(user.id));

  const recruiterManageableTeams = recruiterTeams?.filter(
    (team) => team.team_role !== "participant",
  );

  const userRecrutableTeams = recruiterManageableTeams?.filter(
    (team) => !userTeams?.some((userTeam) => userTeam.id === team.id),
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" disabled={!userId || userId === user.id}>
          <UserPlus className="mr-2 h-5 w-5" />
          Recruit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Which team would you like to recruit{" "}
            <span className="text-destructive">{user.username}</span> to?
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRecruit)}
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
                      {userRecrutableTeams?.length ? (
                        userRecrutableTeams?.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))
                      ) : (
                        <DialogDescription>
                          You do not have any teams to recruit this user to.
                        </DialogDescription>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    You can only recruit a user to a team you are the owner or
                    manager of.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {loading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Recruit
              </Button>
            ) : (
              <Button type="submit">
                <UserPlus className="mr-2 h-5 w-5" />
                Recruit
              </Button>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
