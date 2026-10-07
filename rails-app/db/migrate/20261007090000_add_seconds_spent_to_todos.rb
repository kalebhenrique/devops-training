class AddSecondsSpentToTodos < ActiveRecord::Migration[8.1]
  def change
    add_column :todos, :seconds_spent, :integer, null: false, default: 0
  end
end
