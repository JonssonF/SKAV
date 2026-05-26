import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Avatar,
  Loader,
  Alert,
  Group,
  Paper,
  Stack,
  Badge,
} from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useMembers } from '../hooks/useMembers';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import { getImageUrl } from '../../../utils/imageUrl';
import type { MemberResponse } from '../../../types/member.types';

function MemberCard({
  member,
  isSelected,
  onSelect,
  onDeselect,
}: {
  member: MemberResponse;
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
}) {
  useEffect(() => {
    if (isSelected) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSelected]);

  return (
    <>
      {!isSelected && (
        <motion.div
          layoutId={`member-${member.id}`}
          onClick={onSelect}
          style={{ cursor: 'pointer' }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <Paper
            shadow="sm"
            radius="md"
            withBorder
            p="lg"
            style={{
              minHeight: 220,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
          <Avatar
            src={member.imageUrl ? getImageUrl(member.imageUrl) : null}
            size={100}
            radius="50%"
            color="blue"
          >
            {member.name.charAt(0)}
          </Avatar>

            <Title order={4} mt="md" ta="center">{member.name}</Title>
            {member.role && (
              <Badge variant="light" color="violet" mt="xs">
                {member.role}
              </Badge>
            )}
            {member.quote && (
              <Text size="sm" c="dimmed" fs="italic" mt="xs" ta="center">
                "{member.quote}"
              </Text>
            )}
          </Paper>
        </motion.div>
      )}

      <AnimatePresence>
        {isSelected && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onDeselect}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                zIndex: 9998,
              }}
            />
            <motion.div
              layoutId={`member-${member.id}`}
              key="expanded"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%',
                zIndex: 9999,
                width: 'min(90vw, 450px)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Paper shadow="xl" radius="md" withBorder p="xl">
                <Stack align="center" gap="md">
                <Avatar
                  src={member.imageUrl ? getImageUrl(member.imageUrl) : null}
                  size={140}
                  radius="50%"
                  color="blue"
                >
                  {member.name.charAt(0)}
                </Avatar>

                  <div style={{ textAlign: 'center' }}>
                    <Title order={3}>{member.name}</Title>
                    {member.role && (
                      <Badge variant="light" color="violet" size="lg" mt="xs">
                        {member.role}
                      </Badge>
                    )}
                  </div>

                  {member.quote && (
                    <Text size="md" c="dimmed" fs="italic" ta="center">
                      "{member.quote}"
                    </Text>
                  )}

                  {member.bio && (
                    <Paper p="sm" radius="sm" bg="var(--mantine-color-default-hover)" w="100%">
                      <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
                        {member.bio}
                      </Text>
                    </Paper>
                  )}

                  <Text
                    size="xs"
                    c="dimmed"
                    ta="center"
                    style={{ cursor: 'pointer' }}
                    onClick={onDeselect}
                  >
                    Klicka här eller utanför för att stänga
                  </Text>
                </Stack>
              </Paper>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function MembersSection() {
  const { data: members, isLoading, error } = useMembers();
  const [selectedId, setSelectedId] = useState<number | null>(null);

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
          Kunde inte hämta bandmedlemmar.
        </Alert>
      </Container>
    );
  }

  if (!members || members.length === 0) {
    return (
      <Container size="lg" py="xl">
        <SectionTitle text="Bandet" />
        <Text c="dimmed" ta="center">Inga medlemmar tillagda än.</Text>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <SectionTitle text="Bandet" />
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            isSelected={selectedId === member.id}
            onSelect={() => setSelectedId(member.id)}
            onDeselect={() => setSelectedId(null)}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
}