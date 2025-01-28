import React from "react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

const AddQuestionForm = React.memo(
  ({ newQuestion, onInputChange, onSubmit, onCancel }) => {
    console.log("Rendering AddQuestionForm");
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(e);
    };

    return (
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Problem Name
            </label>
            <Input
              type="text"
              name="problem"
              value={newQuestion.problem}
              onChange={onInputChange}
              className="mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Practice Link
            </label>
            <Input
              type="url"
              name="practice"
              value={newQuestion.practice}
              onChange={onInputChange}
              className="mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={newQuestion.difficulty}
              onChange={onInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <Input
            type="text"
            name="category"
            value={newQuestion.category}
            onChange={onInputChange}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Time Complexity
          </label>
          <Input
            type="text"
            name="timeComplexity"
            value={newQuestion.timeComplexity}
            onChange={onInputChange}
            className="mt-1"
            placeholder="e.g., O(n)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Space Complexity
          </label>
          <Input
            type="text"
            name="spaceComplexity"
            value={newQuestion.spaceComplexity}
            onChange={onInputChange}
            className="mt-1"
            placeholder="e.g., O(1)"
          />
        </div> */}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              className="flex items-center space-x-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex items-center space-x-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Question
            </Button>
          </div>
        </form>
      </Card>
    );
  }
);

export default AddQuestionForm;
