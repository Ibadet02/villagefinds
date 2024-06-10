import { useNavigate } from 'react-router-dom';

import { Container } from '@/components/layout/customer';
import { Button } from '@/components/forms';

export function Topbar() {
  const navigate = useNavigate();

  return (
    <div className="h-14 shrink-0 bg-warning">
      <Container className="h-full">
        <div className="flex h-full items-center justify-center gap-x-2.5">
          <p className="text-xs text-success sm:text-sm md:text-xl lg:text-2xl">
            Start your online business with Village Finds
          </p>
          <Button
            color="light"
            className="py-2 text-xs sm:text-sm md:text-xl"
            onClick={() => navigate('sell')}
          >
            Join Now
          </Button>
        </div>
      </Container>
    </div>
  );
}
