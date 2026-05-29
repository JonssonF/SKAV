import { Container } from '@mantine/core';

const SPOTIFY_ARTIST_ID = '4ViGGyIDRLTOVghW0qmu8m';

export function SpotifyPlayer() {
  return (
    <Container size="lg" mb="md">
      <iframe
        style={{ borderRadius: 12 }}
        src={`https://open.spotify.com/embed/artist/${SPOTIFY_ARTIST_ID}?utm_source=generator`}
        width="100%"
        height={152}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="SKAV på Spotify"
      />
    </Container>
  );
}