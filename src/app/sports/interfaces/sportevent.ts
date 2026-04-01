export interface SportEvent {
  idEvent?: string;
  strSport?: string;

  strEvent?: string;
  strHomeTeam?: string;
  strAwayTeam?: string;

  strLeague?: string;
  intRound?: number | string;
  intHomeScore?: number | string | null;
  intAwayScore?: number | string | null;

  strDescriptionEN?: string;

  dateEvent?: string;

  strThumb?: string;
  strPoster?: string;
  strBanner?: string;
  strSquare?: string;

  strHomeTeamBadge?: string;
  strAwayTeamBadge?: string;

  strVenue?: string;
  strCity?: string;
  strCountry?: string;
}
