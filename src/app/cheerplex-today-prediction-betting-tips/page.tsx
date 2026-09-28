import { Metadata } from 'next';
import { getPageMetadata } from '@/src/lib/generatePageMetadata';
import SokaPageServer from '@/src/components/SokaPageServer';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('cheerplex-today-prediction-betting-tips', '/cheerplex-today-prediction-betting-tips/');
}

export default function CheerplexTodayPredictionsPage() {
  return <SokaPageServer pageId="cheerplex-today-prediction-betting-tips" customCanonical="/cheerplex-today-prediction-betting-tips/" />;
}
