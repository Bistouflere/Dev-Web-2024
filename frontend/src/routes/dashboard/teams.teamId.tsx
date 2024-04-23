import { teamQueryOptions, teamUsersQueryOptions } from "@/api/teams";
import { updateTeam } from "@/api/userActions";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRightIcon, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

const teamFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Team name must be at least 2 characters.",
    })
    .max(30, {
      message: "Team name must not be longer than 30 characters.",
    })
    .trim(),
  description: z
    .string()
    .max(160, {
      message: "Team description must not be longer than 160 characters.",
    })
    .trim()
    .optional(),
  file: z.instanceof(File).optional(),
  visibility: z.boolean(),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

export default function TeamDetailPage() {
  const { searchTeamId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId, getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: team,
    isLoading: teamIsLoading,
    isFetching: teamIsFetching,
  } = useQuery(teamQueryOptions(searchTeamId || ""));

  const {
    data: users,
    isLoading: usersLoading,
    isFetching: userIsFetching,
  } = useQuery(teamUsersQueryOptions(searchTeamId || ""));

  useEffect(() => {
    if (!teamIsLoading && !teamIsFetching && !team) {
      navigate("/dashboard/teams");
    }

    if (!usersLoading && !userIsFetching && !users) {
      navigate("/dashboard/teams");
    }

    if (team && users) {
      const isOwnerOrManager = users.some(
        (user) => user.id === userId && user.team_role !== "participant",
      );

      if (!isOwnerOrManager) navigate("/dashboard/teams");
    }
  }, [
    team,
    teamIsLoading,
    teamIsFetching,
    users,
    usersLoading,
    userIsFetching,
    userId,
    navigate,
  ]);

  const form = useForm<TeamFormValues>({
    defaultValues: {
      name: team?.name || "",
      description: team?.description || "",
      file: undefined,
      visibility: Boolean(team?.open),
    },
    values: {
      name: team?.name || "",
      description: team?.description || "",
      visibility: Boolean(team?.open),
    },
    mode: "onChange",
    resolver: zodResolver(teamFormSchema),
  });

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [`teams`] });
    queryClient.invalidateQueries({
      queryKey: [`team_users_${userId}`],
    });
  }, [queryClient, userId]);

  const onSubmit = async (data: TeamFormValues) => {
    if (
      data.name === team?.name &&
      data.description === team?.description &&
      data.visibility === team?.open &&
      !data.file
    ) {
      toast({
        variant: "destructive",
        title: "No changes detected.",
        description: `No changes were detected in your team details.`,
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description ?? "");
    if (data.file) formData.append("file", data.file);
    formData.append("visibility", data.visibility?.toString() ?? "false");

    try {
      setLoading(true);
      const response = await updateTeam(
        team!.id!,
        formData,
        getToken,
        invalidateQueries,
      );

      toast({
        title: "Success!",
        description: `${response.name} has been updated.`,
      });

      setTimeout(() => {
        navigate(`/dashboard/teams/${response.id}`);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error("Error updating team:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          (error as Error).message ||
          `An error occurred while updating your team.`,
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
            <Link to="/dashboard/teams">Your Teams</Link>
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="font-medium text-foreground">{searchTeamId}</div>
        </div>
        {team && users && (
          <div className="space-y-2">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {team.name}
            </h1>
            <p className="pb-2 text-xl text-muted-foreground">
              Edit your team details below.
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (Required)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Give your team a name..."
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
                        placeholder="Describe your team..."
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
                            onChange(
                              event.target.files && event.target.files[0],
                            );
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
                          Should everyone be able to join your team?
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
                  <Button type="submit">Edit Team</Button>
                )}
              </form>
            </Form>
          </div>
        )}
      </div>
    </main>
  );
}
