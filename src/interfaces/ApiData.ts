export interface ApiData {
    id: number;
    game_id: string;
    sport: string;
    market_type: string;
    player_name: string;
    line_value: number;
    home_team: string;
    away_team: string;
    over_book: string;
    under_book: string;
    over_odds: number;
    under_odds: number;
    profit_percent: number;
    detected_at: string;
}