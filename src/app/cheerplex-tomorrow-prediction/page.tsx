import { Metadata } from 'next';
import { getPageMetadata } from '@/src/lib/generatePageMetadata';
import SokaPageServer from '@/src/components/SokaPageServer';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('cheerplex-tomorrow-prediction', '/cheerplex-tomorrow-prediction/');
}

export default function CheerplexTomorrowPredictionsPage() {
  return <SokaPageServer pageId="cheerplex-tomorrow-prediction" customCanonical="/cheerplex-tomorrow-prediction/" />;
}
