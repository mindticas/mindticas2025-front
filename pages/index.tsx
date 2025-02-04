import Calendar from '@/src/components/Calendar';
import {Provider} from '@/src/components/ui/provider'

export default function Home() {
  return (
    <>
        <Provider>
          <Calendar />
        </Provider>
    </>
  );
}
