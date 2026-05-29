import { useState, useEffect } from 'react';
import {
  Container,
  Text,
  SimpleGrid,
  Loader,
  Alert,
  Group,
  Badge,
  Stack,
} from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useMembers } from '../hooks/useMembers';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import { getImageUrl } from '../../../utils/imageUrl';
import type { MemberResponse } from '../../../types/member.types';

const CARD_ASPECT_RATIO = 2 / 3;

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
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (isSelected) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsFlipped(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSelected]);

  const handleCardClick = () => {
    if (!isSelected) {
      onSelect();
    } else {
      setIsFlipped((f) => !f);
    }
  };

  const imageUrl = member.imageUrl ? getImageUrl(member.imageUrl) : null;

  return (
    <>
      {!isSelected && (
        <motion.div
          layoutId={`member-${member.id}`}
          onClick={handleCardClick}
          style={{
            cursor: 'pointer',
            perspective: 1000,
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <div
            style={{
              width: '100%',
              paddingBottom: `${(1 / CARD_ASPECT_RATIO) * 100}%`,
              position: 'relative',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={member.name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--mantine-color-dark-6)',
                  fontSize: 64,
                  fontWeight: 700,
                  color: 'var(--mantine-color-dark-2)',
                }}
              >
                {member.name.charAt(0)}
              </div>
            )}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '40px 16px 16px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                color: 'white',
              }}
            >
              <Text fw={700} size="lg" style={{ color: 'white' }}>
                {member.name}
              </Text>
              {member.role && (
                <Text size="sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {member.role}
                </Text>
              )}
            </div>
          </div>
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
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                zIndex: 9998,
              }}
            />
            <motion.div
              layoutId={`member-${member.id}`}
              key="expanded"
              onClick={handleCardClick}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%',
                zIndex: 9999,
                width: 'min(85vw, 380px)',
                cursor: 'pointer',
                perspective: 1200,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  width: '100%',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Framsida – bilden */}
                <div
                  style={{
                    width: '100%',
                    paddingBottom: `${(1 / CARD_ASPECT_RATIO) * 100}%`,
                    position: 'relative',
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={member.name}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'var(--mantine-color-dark-6)',
                        fontSize: 80,
                        fontWeight: 700,
                        color: 'var(--mantine-color-dark-2)',
                      }}
                    >
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '50px 20px 20px',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                      color: 'white',
                    }}
                  >
                    <Text fw={700} size="xl" style={{ color: 'white' }}>
                      {member.name}
                    </Text>
                    {member.role && (
                      <Text size="md" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        {member.role}
                      </Text>
                    )}
                    <Text size="xs" mt="sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Tryck för att vända
                    </Text>
                  </div>
                </div>

                {/* Baksida – info */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    paddingBottom: `${(1 / CARD_ASPECT_RATIO) * 100}%`,
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    backgroundColor: 'var(--mantine-color-body)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      padding: 24,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflowY: 'auto',
                    }}
                  >
                    <Stack align="center" gap="md" style={{ width: '100%' }}>
                      <Text fw={700} size="xl" ta="center">
                        {member.name}
                      </Text>

                      {member.role && (
                        <Badge variant="light" color="violet" size="lg">
                          {member.role}
                        </Badge>
                      )}

                      {member.quote && (
                        <Text size="md" c="dimmed" fs="italic" ta="center">
                          "{member.quote}"
                        </Text>
                      )}

                      {member.bio && (
                        <Text
                          size="sm"
                          ta="center"
                          style={{ whiteSpace: 'pre-line', maxWidth: '100%' }}
                        >
                          {member.bio}
                        </Text>
                      )}

                      <Text size="xs" c="dimmed" mt="sm">
                        Tryck för att vända tillbaka
                      </Text>
                    </Stack>
                  </div>
                </div>
              </motion.div>
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
      <SimpleGrid cols={{ base: 2, sm: 2, md: 3 }} spacing="lg">
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