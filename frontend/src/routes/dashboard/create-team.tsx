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
import { Label } from "@/components/ui/label";
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

const formSchema = z.object({
  team_name: z.string().min(2, {
    message: "Team name must be at least 2 characters.",
  }),
  team_description: z
    .string()
    .min(4, {
      message: "Team description must be at least 4 characters.",
    })
    .optional(),
  team_image_url: z.string().optional(),
});

export default function CreateTeamPage() {
  const navigate = useNavigate();
  const { userId, getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      team_name: "",
      team_description: "",
      team_image_url: "",
    },
  });

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [`team_users_${userId}`],
    });
  }, [queryClient, userId]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const formData = {
      team_name: data.team_name,
      team_description: data.team_description,
      team_image_url: data.team_image_url,
    };

    console.log(formData);

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
  }

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
                name="team_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Required)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Give a name at your team !"
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
                name="team_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about your team..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Give a brief description of your team.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="team_image_url"
                render={({ field }) => (
                  <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="file">Picture</Label>
                    <Input type="file" id="file" accept="image/*" {...field} />
                    <FormDescription>
                      Upload an image to represent your team.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button type="submit">Create Team</Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
