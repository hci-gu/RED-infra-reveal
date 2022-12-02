import { Title } from 'solid-start'
import Counter from '~/components/Counter'
import Map from '~/components/Map'
import PacketList from '~/components/PacketList'

export default function Home() {
  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
      <Counter />
      <Map />
      <PacketList />
      <p>
        Visit{' '}
        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{' '}
        to learn how to build SolidStart apps.
      </p>
    </main>
  )
}
