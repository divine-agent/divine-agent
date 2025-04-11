package model

type ChatInput struct {
	// Model is the model name
	Model string `json:"model,required"`
	// Messages is the list of messages
	Messages []Message `json:"messages,required"`
	// Temperature is the temperature of the model
	Temperature *float64 `json:"temperature,omitempty"`
	// TopP is the top-p of the model
	TopP *float64 `json:"top_p,omitempty"`
	// N is the number of responses
	N *int `json:"n,omitempty"`
	// Stream is whether to stream the response
	Stream *bool `json:"stream,omitempty"`
	// Logprobs is whether to return log probabilities of the output tokens or not
	Logprobs *bool `json:"logprobs,omitempty"`
	// TopLogprobs is the number of top log probabilities to return
	TopLogprobs *int `json:"top_logprobs,omitempty"`
}

type Message struct {
	// Role is the role of the message
	Role string `json:"role,required"`
	// Content is the content of the message
	Content string `json:"content,required"`
	// Name is the name of the message
	Name *string `json:"name,omitempty"`
}
