# Features added to the MVP

The project now includes an architecture and UI for the feature set observed on the referenced invitation platforms.

## Invitation experience
- Animated/opening gate
- Countdown-ready structure
- Gallery/video-ready sections
- Music control placeholder
- Maps and calendar actions
- Arabic-first RTL with multilingual-ready configuration
- WhatsApp sharing action
- Public invitation URL `/i/[slug]`

## Guest management
- RSVP status
- Companion/plus-one count
- Guest notes
- General, individual and family links
- CSV export action placeholder

## Wedding operations
- Tables and seats
- QR seat-finder/check-in flow placeholder
- Guest lookup architecture
- Memories area for photos, videos and wishes

## Template system
- `lib/feature-schema.ts` defines feature flags per template.
- Templates can expose/hide sections without changing the invitation engine.

## Important
These are product foundations and interactive UI prototypes. Persistence, authentication, QR signing, cloud storage, payment, rate limiting, and production security still need backend implementation.
