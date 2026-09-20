export default function Logo({ className = 'w-9 h-9' }) {
  return (
    <img
      src={import.meta.env.BASE_URL + 'favicon.svg'}
      alt="Teman Cerita"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  )
}
