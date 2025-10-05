import { fixGrammar } from "@/http/api";
import { useMutation } from "@tanstack/react-query";

export const useFixGrammar = () => {
    return useMutation({
        mutationFn: async (text: string) => {
            return fixGrammar(text);
        },
    });
};
