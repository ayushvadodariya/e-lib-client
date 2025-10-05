import { improveDescription } from "@/http/api";
import { useMutation } from "@tanstack/react-query";

interface ImproveDescriptionParams {
    text: string;
    prompt?: string;
}

export const useImproveDescription = () => {
    return useMutation({
        mutationFn: async ({ text, prompt }: ImproveDescriptionParams) => {
            return improveDescription(text, prompt);
        },
    });
};
