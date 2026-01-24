package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type TestDBItem struct {
	Id       string `dynamodbav:"id"`
	Name     string `dynamodbav:"name"`
	Age      int    `dynamodbav:"age"`
	Email    string `dynamodbav:"email"`
	IsActive bool   `dynamodbav:"isActive"`
}

func main() {
	// Load the aws configuration
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Fatalf("Error loading default config: %v", err)
		os.Exit(0)
	}

	dynamoClient := dynamodb.NewFromConfig(cfg)

	tableName := "TestSchemaValidator"
	targetId := "7238a772-c5a4-4015-8f46-6aef49e41f18"

	queryInput := &dynamodb.QueryInput{
		TableName:              aws.String(tableName),
		KeyConditionExpression: aws.String("id = :id"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":id": &types.AttributeValueMemberS{
				Value: targetId,
			},
		},
	}

	record, err := dynamoClient.Query(context.TODO(), queryInput)
	if err != nil {
		log.Fatalf("Error executing query: %v", err)
		os.Exit(0)
	}

	var records []TestDBItem
	err = attributevalue.UnmarshalListOfMaps(record.Items, &records)
	if err != nil {
		log.Fatalf("Error unmarshalling record: %v", err)
		os.Exit(0)
	}

	if records == nil {
		fmt.Println("No record queried...")
		return
	}

	for _, r := range records {
		fmt.Println(r)
	}
}
