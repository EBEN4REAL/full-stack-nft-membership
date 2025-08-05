import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Welcome to Airdrop Dist</h1>
      <p>
        This landing page is public. To access exclusive content, connect your
        wallet and visit{' '}
        <Link href="/members" className="text-blue-600 underline">
          /members
        </Link>
        .
      </p>
    </div>
  );
}
