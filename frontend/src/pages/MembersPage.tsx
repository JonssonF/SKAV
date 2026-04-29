import {
  Container,
  Title,
  Text,
  Card,
  SimpleGrid,
  Avatar,
  Stack,
  Loader,
  Alert,
  Group,
} from '@mantine/core';
import { useMembers } from '../features/members/hooks/useMembers';

export function MembersPage() {
  const { data: members, isLoading, error } = useMembers();

  if (isLoading) {
    return (
      <Container py="xl">
        <Group justify="center">
          <Loader size="lg" />
        </Group>
      </Container>
    );
  }

  if (error) {
    return (
      <Container py="xl">
        <Alert color="red" title="Något gick fel">
          Kunde inte hämta bandmedlemmar. Är backend igång?
        </Alert>
      </Container>
    );
  }

  if (!members || members.length === 0) {
    return (
      <Container py="xl">
        <Title order={1} mb="lg">Bandet</Title>
        <Text c="dimmed">Inga medlemmar tillagda än.</Text>
      </Container>
    );
  }

  return (
    <Container py="xl">
      <Title order={1} mb="lg">Bandet</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {members.map((member) => (
          <Card
            key={member.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
          >
            <Stack align="center" gap="md">
              <Avatar
                src={member.imageUrl}
                size={120}
                radius="50%"
                color="blue"
              >
                {member.name.charAt(0)}
              </Avatar>
              <div style={{ textAlign: 'center' }}>
                <Title order={3}>{member.name}</Title>
                {member.quote && (
                  <Text c="dimmed" fs="italic" mt="xs">
                    "{member.quote}"
                  </Text>
                )}
              </div>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}