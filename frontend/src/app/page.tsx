export default function Home() {
  return (
    <div className="mt-24">
      <section className="text-center space-y-4">
        <h2 className="text-xl font-semibold">Welcome!</h2>
        <p>
          I'm a senior CS student at <strong>NYU Shanghai</strong> (Class of
          2025), passionate about decentralized systems and cryptocurrency ⚙️.
        </p>
        <p>Recent projects:</p>
        <ul className="space-y-2">
          <li>
            <a
              href="https://github.com/ChenYujunjks/poker_tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Poker Tracker
            </a>{" "}
            – A full-stack application for recording online poker sessions and
            performing data analytics, <br />
            线上扑克局记录与数据分析的全栈应用。
          </li>
          <li>
            <a
              href="https://github.com/ChenYujunjks/NYUSH_Capstone_Project"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              NYUSH Capstone Project
            </a>{" "}
            – A decentralized messaging DApp and related smart contracts
            developed as a senior capstone at NYU Shanghai, <br />
            去中心化消息应用（DApp）与相关智能合约的毕业设计。
          </li>
        </ul>
        <p>
          Skills: Go · TypeScript · React/Next.js · MySQL · Python · Solidity
        </p>
      </section>
    </div>
  );
}
