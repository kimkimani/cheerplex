import { Metadata } from 'next';
import { getPageMetadata } from '@/src/lib/generatePageMetadata';
import SokaPageServer from '@/src/components/SokaPageServer';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('cheerplex-yesterday-prediction', '/cheerplex-yesterday-prediction/');
}

export default function CheerplexYesterdayPredictionsPage() {
  return <SokaPageServer pageId="cheerplex-yesterday-prediction" customCanonical="/cheerplex-yesterday-prediction/" />;
}
