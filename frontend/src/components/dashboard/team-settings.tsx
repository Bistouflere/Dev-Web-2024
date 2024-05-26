import { teamQueryOptions } from "@/api/teams";
import { deleteTeam, updateTeam } from "@/api/userActions";
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
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Loader2, Pencil, Trash } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
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

export function DashboardTeamSettings() {
  const { searchTeamId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: team } = useSuspenseQuery(teamQueryOptions(searchTeamId || ""));

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  const form = useForm<TeamFormValues>({
    defaultValues: {
      name: team.name,
      description: team.description || "",
      file: undefined,
      visibility: Boolean(team.open),
    },
    values: {
      name: team.name,
      description: team.description || "",
      visibility: Boolean(team.open),
    },
    mode: "onChange",
    resolver: zodResolver(teamFormSchema),
  });

  const onSubmit = async (data: TeamFormValues) => {
    if (
      data.name === team.name &&
      data.description === team.description &&
      data.visibility === team.open &&
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
        team.id,
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

  async function handleDeleteTeam() {
    if (!window.confirm("Are you sure you want to delete this team?")) return;

    try {
      setLoading(true);
      await deleteTeam(team.id, getToken, invalidateQueries);
      toast({
        title: "Success!",
        description: `${team.name} has been deleted.`,
      });

      setTimeout(() => {
        navigate("/dashboard/teams");
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error("Error deleting team:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          (error as Error).message ||
          `An error occurred while deleting your team.`,
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
                <Input placeholder="Give your team a name..." {...field} />
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
              <Textarea placeholder="Describe your team..." {...field} />
              <FormDescription>
                This is the description that will be displayed to other users.
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
        <div className="flex justify-between">
          {loading ? (
            <Button type="submit" disabled>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </Button>
          ) : (
            <Button type="submit">
              <Pencil className="mr-2 h-5 w-5" />
              Edit Team
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
              onClick={() => handleDeleteTeam()}
            >
              <Trash className="mr-2 h-5 w-5" />
              Delete Team
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
