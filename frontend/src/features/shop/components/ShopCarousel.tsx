import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Card,
  Image,
  Text,
  Badge,
  Stack,
  Button,
  Group,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { useProducts } from '../hooks/useProducts';
import { getImageUrl } from '../../../utils/imageUrl';
import { SectionTitle } from '../../../components/ui/SectionTitle';

export function ShopCarousel() {
  const { data: products } = useProducts();
  const navigate = useNavigate();

  const inStockProducts = (products ?? []).filter((p) =>
    p.variants.some((v) => v.stockQuantity > 0)
  );

  if (inStockProducts.length === 0) return null;

  return (
    <Container size="lg" py="xl">
      <div style={{ position: 'relative' }}>
        <SectionTitle text="Merch" mb="lg" />
        <Button
          variant="subtle"
          onClick={() => navigate('/shop')}
          style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
        >
          Se alla →
        </Button>
      </div>

        <Carousel
          slideSize={{ base: '100%', sm: '50%', md: '33.333%' }}
          slideGap="md"
          withIndicators
        >
        {inStockProducts.map((product) => {
          const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
          const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];

          return (
            <Carousel.Slide key={product.id}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/shop')}
              >
                <Card.Section>
                  <Image
                    src={getImageUrl(primaryImage?.imageUrl)}
                    height={200}
                    alt={product.title}
                    fallbackSrc="https://placehold.co/400x200?text=Ingen+bild"
                  />
                </Card.Section>

                <Stack gap="xs" mt="md">
                  <Group justify="space-between">
                    <Text fw={600}>{product.title}</Text>
                    <Badge variant="light" size="lg">{product.price} kr</Badge>
                  </Group>

                  <Text size="sm" c="dimmed" lineClamp={2}>
                    {product.description}
                  </Text>

                  <Badge
                    variant="light"
                    color={totalStock > 0 ? 'green' : 'red'}
                    size="sm"
                  >
                    {totalStock > 0 ? `${totalStock} i lager` : 'Slut i lager'}
                  </Badge>
                </Stack>
              </Card>
            </Carousel.Slide>
          );
        })}
      </Carousel>
    </Container>
  );
}