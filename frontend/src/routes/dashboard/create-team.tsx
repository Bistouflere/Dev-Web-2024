import { createTeam } from "@/api/userActions";
import { Button } from "@/components/ui/button";
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
import { useQueryClient } from "@tanstack/react-query";
import { ChevronRightIcon } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const teamFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Team name must be at least 2 characters.",
    })
    .max(30, {
      message: "Team name must not be longer than 30 characters.",
    }),
  description: z
    .string()
    .max(160, {
      message: "Team description must not be longer than 160 characters.",
    })
    .optional(),
  file: z.instanceof(FileList).optional(),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

const defaultValues: Partial<TeamFormValues> = {
  name: "",
  description: "",
};

export default function CreateTeamPage() {
  const navigate = useNavigate();
  const { userId, getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues,
  });
  const fileRef = form.register("file");

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [`teams`] });
    queryClient.invalidateQueries({
      queryKey: [`team_users_${userId}`],
    });
  }, [queryClient, userId]);

  const onSubmit = async (data: TeamFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description ?? "");
    if (data.file) formData.append("file", data.file[0]);

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      const response = await createTeam(formData, getToken, invalidateQueries);

      toast({
        title: "Success!",
        description: `The team ${response.name} has been created.`,
      });

      navigate(`/dashboard/teams/${response.id}`);
    } catch (error) {
      console.error("Error creating team:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          (error as Error).message ||
          `An error occurred while creating your team.`,
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
          <div className="font-medium text-foreground">Create Team</div>
        </div>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Create Team
          </h1>
          <p className="pb-2 text-xl text-muted-foreground">
            Create your team and start competing with your friends !
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
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
                    <Textarea placeholder="Describe your team..." {...field} />
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        {...fileRef}
                        onChange={(event) => {
                          field.onChange(event.target?.files?.[0] ?? undefined);
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
              <Button type="submit">Update profile</Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
