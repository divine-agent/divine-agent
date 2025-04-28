package model

type EvaluationScore struct {
	Name                    string             `json:"name"`
	Score                   float32            `json:"score"`
	RepresentativeReasoning string             `json:"representative_reasoning"`
	AllEvaluations          []EvaluationResult `json:"all_evaluations"`
}

type EvaluationResult struct {
	Name      string `json:"name"`
	Judgment  bool   `json:"judgment"`
	Reasoning string `json:"reasoning"`
}
