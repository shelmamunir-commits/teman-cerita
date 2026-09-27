export default function Logo({ className = 'w-9 h-9' }) {
  return (
    <img
      src={import.meta.env.BASE_URL + 'icon.jpeg'}
      alt="Logo Pesma Nur Alannur"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  )
}
