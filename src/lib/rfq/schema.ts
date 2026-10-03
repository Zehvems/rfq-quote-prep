import {z} from "zod";

export const rfqSchema = z.object({
    productType: z.string().nullable(),
    quantity: z.number().int().nullable(),
    specification: z.string().nullable(),
    deadline: z.string().nullable(),
    deliveryLocation: z.string().nullable(),
});

export type RFQData = z.infer<typeof rfqSchema>;