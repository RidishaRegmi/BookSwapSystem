from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)
    full_name = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)
    

class Meta:
    model = User
    fields = ('email', 'password', 'full_name', 'location', 'city', 'lat', 'lng')
    extra_kwargs = {
        'lat': {'required': False, 'allow_null': True},
        'lng': {'required': False, 'allow_null': True},
    }

   

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data.get('full_name', ''),
            city=validated_data.get('city', ''),
            location=validated_data.get('location', ''),
            lat=validated_data.get('lat'),
            lng=validated_data.get('lng'),
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        user = User.objects.filter(email=email).first()
        if user is None or not user.check_password(password):
            raise serializers.ValidationError("Invalid email or password.")
        if user.is_blocked:
            raise serializers.ValidationError("This account has been blocked.")
        data['user'] = user
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'full_name', 'is_admin', 'location', 'created_at', 'profile_image')
        read_only_fields = ('id', 'email', 'created_at', 'is_admin')


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'full_name', 'is_admin', 'is_blocked', 'location', 'created_at')