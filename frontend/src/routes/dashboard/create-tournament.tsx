import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronRightIcon, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Balancer from "react-wrap-balancer";
import { z } from "zod";

const games = [
    { label: "League Of Legends", value: "lol" },
    { label: "Counter-Strike: Global Offensive", value: "csgo" },
    { label: "Fortnite", value: "fortnite" },
    { label: "Valorant", value: "valorant" },
    { label: "Rocket League", value: "rocketLeague" },
    { label: "Apex Legends", value: "apex" },
    { label: "Fifa 24", value: "fifa" },
    { label: "Overwatch", value: "overwatch" },
    { label: "Brawl Stars", value: "brawlStars" },
] as const

const format = [
    { label: "BO1", value: "bo1" },
    { label: "BO3", value: "bo3" },
    { label: "BO5", value: "bo5" },
] as const

const profileFormSchema = z.object({
    username: z
        .string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        })
        .max(30, {
            message: "Username must not be longer than 30 characters.",
        }),
    bio: z.string().max(160).min(4),
    game: z.string({
        required_error: "Please select a game.",
    }),
    format: z.string({
        required_error: "Please select a format.",
    }),
    picture: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function CreateTournamentPage() {
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        mode: "onChange",
    });

    function onSubmit(data: ProfileFormValues) {
        console.log(data);

        toast({
            title: "Your tournament is created !",
        });
    }

    const [hoveredGameIndex, setHoveredGameIndex] = useState<number | null>(null);

    return (
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
            <div className="mx-auto w-full min-w-0">
                <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        Dashboard
                    </div>
                    <ChevronRightIcon className="h-4 w-4" />
                    <div className="font-medium text-foreground">Create My Tournament</div>
                </div>
                <div className="space-y-2">
                    <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
                        Create My Tournament
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        <Balancer>This is the protected tournament creation page.</Balancer>
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="username"
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
                                        This is the public name under which you will be displayed during the tournament. Please note that this name cannot be changed once chosen.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description *</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little bit about your tournament..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="game"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Game</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-[200px] justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? games.find(
                                                            (games) => games.value === field.value
                                                        )?.label
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
                                                                    form.setValue("game", game.value)
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        game.value === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
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

                        <FormItem>
                            <FormLabel>Format</FormLabel>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bo1">BO1</SelectItem>
                                    <SelectItem value="bo3">BO3</SelectItem>
                                    <SelectItem value="bo5">BO5</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>

                        <FormItem>
                            <FormLabel>Public</FormLabel>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="true">Yes</Label>
                                <Switch id="airplane-mode" />
                                <Label htmlFor="false">No</Label>
                            </div>
                        </FormItem>

                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="picture">Picture</Label>
                            <Input id="picture" type="file" />
                        </div>
                        <Button type="submit">Create My Team</Button>
                    </form>
                </Form>
            </div>
        </main>
    );
}
