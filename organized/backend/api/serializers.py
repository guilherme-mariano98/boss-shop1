from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Category, Product, Order, OrderItem

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'password')
        read_only_fields = ('id', 'date_joined', 'username', 'email')
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
        }
        
    def validate_password(self, value):
        """
        Validate password strength
        """
        if value:
            try:
                validate_password(value)
            except ValidationError as e:
                raise serializers.ValidationError(e.messages)
        return value
    
    def validate_email(self, value):
        """
        Check if email is already in use (only for create operations)
        """
        if self.instance is None:  # Only check for new users
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("Este email já está registrado.")
        return value
    
    def validate_username(self, value):
        """
        Check if username is already in use (only for create operations)
        """
        if self.instance is None:  # Only check for new users
            if User.objects.filter(username=value).exists():
                raise serializers.ValidationError("Este nome de usuário já está em uso.")
        return value
    
    def validate_first_name(self, value):
        """
        Validate first name
        """
        if value and len(value) < 2:
            raise serializers.ValidationError("O nome deve ter pelo menos 2 caracteres.")
        return value
    
    def validate_last_name(self, value):
        """
        Validate last name
        """
        if value and len(value) < 2:
            raise serializers.ValidationError("O sobrenome deve ter pelo menos 2 caracteres.")
        return value
    
    def validate(self, attrs):
        """
        Object-level validation
        """
        # Additional custom validations can be added here
        return attrs
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        # Only update first_name and last_name
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()
        return instance

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = ('total_amount', 'shipping_address', 'payment_method', 'items')
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        return order