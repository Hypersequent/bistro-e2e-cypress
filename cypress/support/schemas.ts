import { z } from 'zod'

export const PriceSchema = z
	.string()
	.regex(/^\$\d+$/)
	.transform((val) => Number.parseInt(val.slice(1), 10))

export const PizzaItemSchema = z.object({
	name: z.string().min(1),
	image: z.string().min(1),
	description: z.string().min(1),
	price: PriceSchema,
})

export const PizzaMenuSchema = z.array(PizzaItemSchema).min(1)

export const OtherItemSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	price: PriceSchema,
})

export const OtherMenuSchema = z.array(OtherItemSchema).min(1)

export const CartItemSchema = z.object({
	name: z.string().min(1),
	amount: PriceSchema,
})

export const CartResponseSchema = z.object({
	items: z.array(CartItemSchema),
	total: PriceSchema,
})

export type PizzaItem = z.infer<typeof PizzaItemSchema>
export type PizzaMenu = z.infer<typeof PizzaMenuSchema>
export type OtherItem = z.infer<typeof OtherItemSchema>
export type OtherMenu = z.infer<typeof OtherMenuSchema>
export type CartItem = z.infer<typeof CartItemSchema>
export type CartResponse = z.infer<typeof CartResponseSchema>
