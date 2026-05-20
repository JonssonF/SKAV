import { Text, Button, Badge, Stack, Group, Paper, Title } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { IconMusic, IconThumbUp } from '@tabler/icons-react';
import type { SongProposalResponse } from '../../../types/songProposal.types';

interface VotingCardProps {
  proposal: SongProposalResponse;
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
  onVote: () => void;
  voteLoading?: boolean;
  hasVoted?: boolean;
}

export function VotingCard({
  proposal,
  isSelected,
  onSelect,
  onDeselect,
  onVote,
  voteLoading,
  hasVoted,
}: VotingCardProps) {
  const handleVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    onVote();
  };

  return (
    <>
      {/* Kortet i gridet */}
      {!isSelected && (
        <motion.div
          layoutId={`proposal-${proposal.id}`}
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
              minHeight: 160,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <Group justify="space-between" mb="xs">
                <IconMusic size={20} style={{ opacity: 0.5 }} />
                <Badge variant="light" color="violet" size="sm">
                  {proposal.voteCount} {proposal.voteCount === 1 ? 'röst' : 'röster'}
                </Badge>
              </Group>
              <Title order={4}>{proposal.title}</Title>
              {proposal.description && (
                <Text size="sm" c="dimmed" mt="xs" lineClamp={2}>
                  {proposal.description}
                </Text>
              )}
            </div>
            <Text size="xs" c="dimmed" mt="md" ta="center">
              Klicka för att läsa mer
            </Text>
          </Paper>
        </motion.div>
      )}

      {/* Expanderad overlay */}
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
                zIndex: 200,
              }}
            />
            <motion.div
              layoutId={`proposal-${proposal.id}`}
              key="expanded"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%',
                zIndex: 201,
                width: 'min(90vw, 500px)',
                maxHeight: '80vh',
                overflow: 'auto',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Paper shadow="xl" radius="md" withBorder p="xl">
                <Stack gap="md">
                  <Group justify="space-between">
                    <Title order={3}>{proposal.title}</Title>
                    <Badge variant="light" color="violet">
                      {proposal.voteCount} {proposal.voteCount === 1 ? 'röst' : 'röster'}
                    </Badge>
                  </Group>

                  {proposal.description && (
                    <Text size="sm">{proposal.description}</Text>
                  )}

                  {proposal.lyricsBody && (
                    <div>
                      <Text size="sm" fw={600} mb="xs">Låttext / textidé</Text>
                      <Paper p="sm" radius="sm" bg="var(--mantine-color-default-hover)">
                        <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
                          {proposal.lyricsBody}
                        </Text>
                      </Paper>
                    </div>
                  )}

                  {proposal.voteHistory.length > 0 && (
                    <div>
                      <Text size="sm" fw={600} mb="xs">Tidigare omröstningar</Text>
                      <Group gap="xs">
                        {proposal.voteHistory.map((snap, i) => (
                          <Badge key={i} variant="outline" color="gray" size="sm">
                            {snap.voteCount} {snap.voteCount === 1 ? 'röst' : 'röster'} – {new Date(snap.snapshotDate).toLocaleDateString('sv-SE')}
                          </Badge>
                        ))}
                      </Group>
                    </div>
                  )}

                  {proposal.createdByEmail && (
                    <Text size="xs" c="dimmed">
                      Föreslagen av: {proposal.createdByEmail}
                    </Text>
                  )}

                  <Button
                    fullWidth
                    size="md"
                    leftSection={<IconThumbUp size={18} />}
                    onClick={handleVote}
                    loading={voteLoading}
                    disabled={hasVoted}
                    color={hasVoted ? 'gray' : 'violet'}
                  >
                    {hasVoted ? 'Tack för din röst!' : 'Rösta på denna'}
                  </Button>

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