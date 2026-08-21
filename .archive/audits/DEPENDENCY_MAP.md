# Dependency Map

This map highlights every downstream system affected by the core PnL calculation bug.

```mermaid
graph TD
    A[Dhan Broker Adapter] -->|Corrupted PnL & Qty| B(Trade Database)
    B --> C{Analytics Engine}
    B --> D{AI Context Builder}
    B --> E{Journal Service}
    
    C --> C1(Win Rate %)
    C --> C2(Average RR)
    C --> C3(Net Profit Dashboard)
    C --> C4(Strategy Effectiveness)
    
    D --> D1(AI Coach Chat Context)
    D --> D2(Pattern Memory / Reminders)
    D --> D3(End of Day AI Brief)
    
    E --> E1(Daily PnL Calendar)
    E --> E2(Discipline Score Engine)
    
    style A fill:#ff9999,stroke:#cc0000
    style B fill:#ffcccc,stroke:#cc0000
```

## Blast Radius
1. **Discipline Score:** Punishes users for breaking rules (e.g., max daily loss) because a profitable trade registered as a massive loss.
2. **AI Coach:** Becomes effectively useless if it bases its behavioral analysis on hallucinated losses.
3. **Strategy Effectiveness:** Traders may abandon highly profitable strategies because TradeVault incorrectly tags them with a negative expectancy.
