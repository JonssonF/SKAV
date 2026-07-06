import { useState } from 'react';
import {
  Container,
  Text,
  SimpleGrid,
  Loader,
  Group,
  Alert,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useSongProposals, useVoteSongProposal } from '../hooks/useSongProposals';
import { VotingCard } from './VotingCard';
import { SectionTitle } from '../../../components/ui/SectionTitle';

export function VotingSection() {
  const { data: proposals, isLoading, error } = useSongProposals();
  const voteMutation = useVoteSongProposal();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const activeProposals = (proposals ?? []).filter((p) => p.isActive);

  const handleVote = (proposalId: number) => {
    voteMutation.mutate(proposalId, {
      onSuccess: () => {
        setHasVoted(true);
        notifications.show({
          title: 'Tack!',
          message: 'Din röst har registrerats.',
          color: 'green',
        });
      },
      onError: () => {
        notifications.show({
          title: 'Kunde inte rösta',
          message: 'Du har redan röstat. ',
          color: 'red',
        });
      },
    });
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
          Kunde inte hämta låtförslag.
        </Alert>
      </Container>
    );
  }

  if (activeProposals.length === 0) return null;

  return (
    <Container size="lg" py="xl">
      <SectionTitle text="Rösta på nästa låt" />
      <Text c="dimmed" ta="center" mb="lg">
        Klicka på ett kort för att läsa mer och rösta!
      </Text>

      <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="lg">
        {activeProposals.map((proposal) => (
          <VotingCard
            key={proposal.id}
            proposal={proposal}
            isSelected={selectedId === proposal.id}
            onSelect={() => setSelectedId(proposal.id)}
            onDeselect={() => setSelectedId(null)}
            onVote={() => handleVote(proposal.id)}
            voteLoading={voteMutation.isPending}
            hasVoted={hasVoted}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
}