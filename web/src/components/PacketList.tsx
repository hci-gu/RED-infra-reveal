import { For } from 'solid-js'
import packets from '~/state/packets'

export default function PacketList() {
  return (
    <div>
      <h1>Packets</h1>
      <For each={packets()}>
        {(packet: any) => (
          <div>
            <h2>{packet.id}</h2>
            <p>Lat: {packet.lat}</p>
            <p>Lon: {packet.lon}</p>
            <p>Client Lat: {packet.clientLat}</p>
            <p>Client Lon: {packet.clientLon}</p>
          </div>
        )}
      </For>
    </div>
  )
}
