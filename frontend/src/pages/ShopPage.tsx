import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Group,
  Button,
  Loader,
  Alert,
  Badge,
  Select,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconShoppingCart } from '@tabler/icons-react';
import { useProducts } from '../features/shop/hooks/useProducts';
import { useCreateProductOrder } from '../features/shop/hooks/useProductOrders';
import { useCart } from '../features/shop/hooks/useCart';
import { ProductCard } from '../features/shop/components/ProductCard';
import { CartDrawer } from '../features/shop/components/CartDrawer';
import { CheckoutModal } from '../features/shop/components/CheckoutModal';
import { getApiErrors, getApiMessage } from '../utils/getApiErrors';

export function ShopPage() {
  const { data: products, isLoading, error } = useProducts();
  const createOrder = useCreateProductOrder();
  const cart = useCart();

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutErrors, setCheckoutErrors] = useState<Record<string, string> | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Unika kategorier
  const categories = [...new Set(
    (products ?? []).map((p) => p.category).filter(Boolean)
  )] as string[];

  const filteredProducts = categoryFilter
    ? (products ?? []).filter((p) => p.category === categoryFilter)
    : (products ?? []);

  const handleCheckout = (data: { name: string; email: string; phone?: string; message?: string }) => {
    setCheckoutErrors(null);

    createOrder.mutate(
      {
        ...data,
        items: cart.items.map((item) => ({
          productVariantId: item.variant.id,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: () => {
          cart.clearCart();
          setCheckoutOpen(false);
          setOrderComplete(true);
          notifications.show({
            title: 'Beställning skickad!',
            message: 'Vi hör av oss med betalningsinformation.',
            color: 'green',
          });
        },
        onError: (err) => {
          const fieldErrors = getApiErrors(err);
          if (fieldErrors) {
            setCheckoutErrors(fieldErrors);
          } else {
            notifications.show({
              title: 'Något gick fel',
              message: getApiMessage(err),
              color: 'red',
            });
          }
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <Group justify="center"><Loader size="lg" /></Group>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert color="red" title="Något gick fel">
          Kunde inte hämta produkter.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>Shop</Title>
        <Button
          variant="light"
          leftSection={<IconShoppingCart size={18} />}
          onClick={() => setCartOpen(true)}
        >
          Varukorg
          {cart.totalItems > 0 && (
            <Badge ml="xs" size="sm" circle>{cart.totalItems}</Badge>
          )}
        </Button>
      </Group>

      {orderComplete && (
        <Alert color="green" title="Tack för din beställning!" mb="lg" withCloseButton onClose={() => setOrderComplete(false)}>
          Vi har tagit emot din beställning och hör av oss snart.
        </Alert>
      )}

      {categories.length > 1 && (
        <Group mb="lg">
          <Select
            placeholder="Alla kategorier"
            data={categories}
            value={categoryFilter}
            onChange={setCategoryFilter}
            clearable
            size="sm"
          />
        </Group>
      )}

      {filteredProducts.length === 0 ? (
        <Text c="dimmed">Inga produkter hittades.</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={cart.addItem}
            />
          ))}
        </SimpleGrid>
      )}

      <CartDrawer
        opened={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart.items}
        totalItems={cart.totalItems}
        totalPrice={cart.totalPrice}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeItem}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        opened={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cart.items}
        totalPrice={cart.totalPrice}
        onSubmit={handleCheckout}
        loading={createOrder.isPending}
        errors={checkoutErrors}
      />
    </Container>
  );
}