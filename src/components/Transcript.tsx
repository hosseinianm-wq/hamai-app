interface Props {
  user?: string
  ai?: string
}

export default function Transcript({ user, ai }: Props) {

  return (
    <div className="text-center space-y-2 mt-10 px-6">

      {user && (
        <p className="text-gray-400">
          شما: {user}
        </p>
      )}

      {ai && (
        <p className="text-white text-lg">
          HamAI: {ai}
        </p>
      )}

    </div>
  )
}
