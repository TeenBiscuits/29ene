import { PollsPage } from '@/components/polls/polls-page';
import { pollsMetadata } from '@/lib/polls/metadata';
export const metadata = pollsMetadata('es');
export default function Page() { return <PollsPage locale="es" />; }
